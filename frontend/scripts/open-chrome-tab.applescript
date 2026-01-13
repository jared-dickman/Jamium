-- Reuse existing Chrome tab or create new one
-- Usage: osascript open-chrome-tab.applescript "http://localhost:3000"

on run argv
    set targetURL to item 1 of argv
    set found to false

    tell application "Google Chrome"
        -- Search all windows and tabs for matching URL
        repeat with w in windows
            set tabIndex to 1
            repeat with t in tabs of w
                if URL of t contains targetURL then
                    set active tab index of w to tabIndex
                    set index of w to 1
                    reload t
                    activate
                    set found to true
                    exit repeat
                end if
                set tabIndex to tabIndex + 1
            end repeat
            if found then exit repeat
        end repeat

        -- No existing tab found, create new one
        if not found then
            activate
            if (count of windows) = 0 then
                make new window
            end if
            tell front window to make new tab with properties {URL:targetURL}
        end if
    end tell
end run
