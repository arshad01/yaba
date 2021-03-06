//
//  com_twopiAppDelegate.m
//  yaba
//
//  Created by TwoPi on 5/5/14.
//  Copyright (c) 2014 TwoPi. All rights reserved.
//

#import "YabaAppDelegate.h"
#import "YabaBookmarkListViewController.h"
#import "YabaBookmarkStore.h"

//#import <FacebookSDK/FacebookSDK.h>
#import <GooglePlus/GooglePlus.h>

@implementation YabaAppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    self.window = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
    
    YabaBookmarkListViewController *yabaBmListViewController =
                                                        [[YabaBookmarkListViewController alloc] init];
    
    UINavigationController *nav = [[UINavigationController alloc]
                                   initWithRootViewController:yabaBmListViewController];
    
    self.window.rootViewController = nav;
    
    [self.window makeKeyAndVisible];
    
    return YES;
}
							
- (void)applicationWillResignActive:(UIApplication *)application
{
    // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
    // Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
}

- (void)applicationDidEnterBackground:(UIApplication *)application
{
    // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later. 
    // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    BOOL success = [[YabaBookmarkStore sharedStore] saveChanges];
    if (success) {
        NSLog(@"Saved all of Bookmarks");
    } else {
        NSLog(@"Could not save any of Bookmarks");
    }
}

- (void)applicationWillEnterForeground:(UIApplication *)application
{
    // Called as part of the transition from the background to the inactive state; here you can undo many of the changes made on entering the background.
}

- (void)applicationDidBecomeActive:(UIApplication *)application
{
    // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
}

- (void)applicationWillTerminate:(UIApplication *)application
{
    // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
{
    NSLog(@"Source Application:%@",sourceApplication);
    if ([sourceApplication isEqualToString:@"com.google.GooglePlus"]) {
        return [GPPURLHandler handleURL:url sourceApplication:sourceApplication annotation:annotation];
    }
    return NO;
}

@end
