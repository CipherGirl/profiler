# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

### Localization for the App UI of Profiler

# Naming convention for l10n IDs: "ComponentName--string-summary".
# This allows us to minimize the risk of conflicting IDs throughout the app.
# Please sort alphabetically by (component name), and
# keep strings in order of appearance.

## The following feature names must be treated as a brand. They cannot be translated.

-firefox-brand-name = Firefox
-profiler-brand-name = Firefox Profiler

##

AppHeader--app-header = <header>{ -profiler-brand-name }</header> — <subheader>Web app for { -firefox-brand-name } performance analysis</subheader>
AppHeader--github-icon =
    .title = Go to our git repository (this opens in a new window)

FooterLinks--legal = Legal
FooterLinks--Privacy = Privacy
FooterLinks--Cookies = Cookies

Home--upload-from-file-input-button = Load a profile from file
Home--upload-from-url-button = Load a profile from a URL
Home--load-from-url-submit-button =
    .value = Load

Home--documentation-button = Documentation
Home--record-instructions =
    To start profiling, click on the profiling button, or use the
    keyboard shortcuts. The icon is blue when a profile is recording. 
    Hit <kbd>Capture Profile</kbd> to load the data into profiler.firefox.com.

Home--instructions-title = How to view and record profiles
Home--instructions-content =
    Recording performance profiles requires <a>{ -firefox-brand-name }</a>.
    However, existing profiles can be viewed in any modern browser.

Home--record-instructions-start-stop = Stop and start profiling
Home--record-instructions-capture-load = Capture and load profile
Home--profiler-motto = Capture a performance profile. Analyze it. Share it. Make the web faster.
Home--additional-content-title = Load existing profiles
Home--additional-content-content = You can <strong>drag and drop</strong> a profile file here to load it, or:
Home--compare-recordings-info = You can also compare recordings. <a>Open the comparing interface.</a>
Home--recent-uploaded-recordings-title = Recent uploaded recordings

# This string is used on the tooltip of the published profile links.
# Variables:
#   $smallProfileName (String) - Shortened name for the published Profile.
ListOfPublishedProfiles--publishedProfilesLink =
    .title = Click here to load profile { $smallProfileName }

ListOfPublishedProfiles--uploaded-profile-information-list-empty = No profile has been uploaded yet!

# This string is used below the 'Recent uploaded recordings' list section.
# Variables:
#   $profilesRestCount (Number) - Remaining numbers of the uploaded profiles which are not listed under 'Recent uploaded recordings'.
ListOfPublishedProfiles--uploaded-profile-information-label = See and manage all your recordings ({ $profilesRestCount } more)

# Depending on the number of uploaded profiles, the message is different.
# Variables:
#   $uploadedProfileCount (Number) - Total numbers of the uploaded profiles.
ListOfPublishedProfiles--uploaded-profile-information-list =
    { $uploadedProfileCount ->
        [one] Manage this recording
       *[other] Manage these recordings
    }

ProfileRootMessage--title = { -profiler-brand-name }
ProfileRootMessage--additional = Back to home
