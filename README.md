#***Welcome to Loco Link API Repository***

## Setup credentials
To start you should first add your credentials to git global store to avoid again and again typing your password.
	> git config --global credential.helper store
	> git config --global user.email "you@example.com"
    > git config --global user.name "Your Name"

##Clone repository

    > git clone https://vivekyadav.visualstudio.com/DefaultCollection/Loco%20Link/_git/LocoLinkAPI

##Visual Studio Code ( Editor )
	1. Open the project folder in Visual Studio Code
	2. You will see the files and folders in the explorer
	3. Now go to GIT tab and do Pull
	4. To see every thing is done properly click on ( ... ) > Show Git Output
	5. If there are no errors. Everything went well. 
	6. If there was and error in authentication 
	7. then do a git pull 
        > git pull https://vivekyadav.visualstudio.com/DefaultCollection/Loco%20Link/_git/LocoLinkAPI

##Now you can start coding and keep making your contribution to get this project to finish line in the most elegant style of coding.


###Steps I ran to create initial project structure
    > express LocoLinkAPI
    Copied all files from /LocoLinkAPI back to / of project and deleted /LocoLinkAPI created inside /
    In / of project:
        > npm install
        
    Went to debug in VS Code then
    clicked on Setting (wheel) choose Node.js Environment
    checked if program path was ${workspaceRoot}\\bin\\www
    Clicked on (>) Start Button or (F5)
    Go to http://localhost:3000 to check if it was working.
    