import re
from bs4 import BeautifulSoup
import requests

from django.db.models import Q

def normalize_query(query_string,
                    findterms=re.compile(r'"([^"]+)"|(\S+)').findall,
                    normspace=re.compile(r'\s{2,}').sub):

    return [normspace(' ', (t[0] or t[1]).strip()) for t in findterms(query_string)]


def build_query(query_string, search_fields):
    ''' Returns a query, that is a combination of Q objects. That combination
        aims to search keywords within a model by testing the given search fields.

    '''
    query = None # Query to search for every search term
    terms = normalize_query(query_string)
    for term in terms:
        or_query = None # Query to search for a given term in each field
        for field_name in search_fields:
            q = Q(**{"%s__icontains" % field_name: term})

            if or_query:
                or_query = or_query |q
            else:
                or_query = q

        if query:
            query = query | or_query
        else:
            query = or_query
    return query

def search(request,model,fields,query_param="q" ):
    """
    """

    query_string = request.GET.get(query_param,"").strip()

    if not query_string:
        return model.objects.filter(user=request.user)

    entry_query = build_query(query_string, fields)

    #print('entry_query=%s'%entry_query)
    found_entries = model.objects.filter(entry_query,user=request.user)

    return found_entries

def get_metas(html):
    field=u'property'
    soup = BeautifulSoup(html)
    metas = soup('meta',property=re.compile('og:'))
    if (len(metas)==0):
        field=u'name'
        metas=soup('meta',attrs={'name': re.compile('og:')})
    ret={}
    for x in [m.attrs for m in metas]:
        ret[x[field]]=unicode(x[u'content'])
    #print('metas=%s'%ret)
    return ret

