
# NBA Discord Bot

[The NBA Discord Bot](https://github.com/lukarh/Discord-Bot) was developed by me, Lukar! It began as a fun little project for my buddies on a Discord Server since we typically host watch parties there and I wanted a way for some people to easily access stats / schedule without having to go to an application or different website. Plus, it's a cool little feature to have on the server for interactivity and engagement purposes, especially with the fake virtual betting feature of the bot (Disclaimer: I am personally not a fan or advocate of sports-betting and only engage in this for fun with friends). File Structure is inspired by [Under Ctrl](https://www.youtube.com/watch?v=JEEcbVjLyr0) and the assets directory was inspired by the [NBA Discord Bot](https://github.com/NBABot-Development-Team/NBABot). 

## Code Development
- Coding Language: JavaScript
- Code Editor: [Visual Studio Code (VSCode)](https://code.visualstudio.com/)
- Developer Data Platform: [MongoDB](https://www.mongodb.com/)
- Relies on NBA Live API Endpoints:  
  -  https://cdn.nba.com/static/json/staticData/scheduleLeagueV2_1.json
  -  https://cdn.nba.com/static/json/liveData/odds/odds_todaysGames.json
  -  https://cdn.nba.com/static/json/liveData/boxscore/boxscore_{gameID}.json
  -  https://cdn.nba.com/static/json/liveData/scoreboard/todaysScoreboard_00.json

### File Structure
- **src/assets/..:** Contains .json mappings of names to emojis, colors, ids, tricodes, etc.
- **src/commands/{commandName}Folder/{commandName}.js:** Contains the logic for available bot commands that users can use and categorizes them
- **src/events/..:** Contains the logic that allows for the bot to listen and respond to specific events that occur in the Discord Server with the bot
- **src/handlers/..:** Contains the logic that handles all the events in the events folder
- **src/utils/..** Contains the logic for various functions that need to be reused throughout the directory

## Current Features on Version 1.2.1

- Automatic Features
  - sendDailyScoreMessage.js: Sends a msg for every game to the NBA Live Games Channel every 24 hours

![image](https://github.com/lukarh/NBA-Discord-Bot/assets/65103724/857d7334-529c-49b5-8727-f685fb727fed)
  - updateGameMessage.js: Updates the NBA Live Games Channel with scores every minute

![image](https://github.com/lukarh/NBA-Discord-Bot/assets/65103724/29d7f0a0-b6fb-4050-8a0b-79cbb84aa810)
- User Commands
  - **/available-game-bets**: Shows the user a list of the betting status for available NBA games.

![image](https://github.com/lukarh/NBA-Discord-Bot/assets/65103724/5d8b770d-be02-446e-aa61-7549216b35b5)

  - **/balance** [optional-user]: Checks the balance of a current user or themselves

![image](https://github.com/lukarh/NBA-Discord-Bot/assets/65103724/3344966e-e3af-4f32-aa15-ce2efac163af)

  - **/bet-east** [team-name] [amount] [game-id]: Allows the user to bet on an Eastern Conference Team to win a specific game.
  - **/bet-west** [team-name] [amount] [game-id]: Allows the user to bet on a Western Conference Team to win a specific game.

![image](https://github.com/lukarh/NBA-Discord-Bot/assets/65103724/d3dc3d89-7b32-4c56-8b1b-ae91f0c2d434)

![image](https://github.com/lukarh/NBA-Discord-Bot/assets/65103724/813920b0-1596-4562-a05b-2bdaf8e2eab7)

  - **/bet-help**: Shows a list of available game bet commands

![image](https://github.com/lukarh/NBA-Discord-Bot/assets/65103724/df25d64c-48e8-46a8-8ebf-f2b188439e66)

  - **/bets-leaderboard**: Shows the bets leaderboard and allows the user to see who has won the most bets and money on the server!
  
![image](https://github.com/lukarh/NBA-Discord-Bot/assets/65103724/e526c196-1749-48ee-ae68-c93219041b92)

  - **/cancel-bet** [game-id]: Cancels a bet a user has made for a specific game if permitted.

![image](https://github.com/lukarh/NBA-Discord-Bot/assets/65103724/47c87879-8e50-40aa-8909-10958662669d)

![image](https://github.com/lukarh/NBA-Discord-Bot/assets/65103724/8a239e51-093d-4d16-93d6-abe7510da8c7)

  - **/claim-bet** [game-id]: Allows for the user to cashout on a bet they made if the game has ended.

![image](https://github.com/lukarh/NBA-Discord-Bot/assets/65103724/2152b383-7a9a-408d-ad18-766a5aa9d514)

![image](https://github.com/lukarh/NBA-Discord-Bot/assets/65103724/2289516f-1143-4eef-ac0c-e24935d9c626)

  - **/current-bets**: Allows the user to see all the current bets made by all users so far.
 
![image](https://github.com/lukarh/NBA-Discord-Bot/assets/65103724/48975964-aee4-4e79-b4df-b382fe67ec52)

  - **/daily**: Allows the user to collect free daily money.

![image](https://github.com/lukarh/NBA-Discord-Bot/assets/65103724/e178c21c-bc9d-49cf-874c-8246776f3a88)
  - **/edit-bet** [amount] [game-id]: Edits a bet a user has made for a specific game if it permits.

![image](https://github.com/lukarh/NBA-Discord-Bot/assets/65103724/9a0086f3-768a-491c-b264-cb4463ab967a)

![image](https://github.com/lukarh/NBA-Discord-Bot/assets/65103724/683788a0-d1af-451e-b0fe-b3addecc55b3)

  - **/process-bets**: [Admin-Only] Allows the bot to perform the /claim-bet functionality for all current bets in the database.

![image](https://github.com/lukarh/NBA-Discord-Bot/assets/65103724/fe5ddb61-eae4-434f-a782-d00ee1be2e34)

  - **/signup**: Allows the user sign-up to create a profile to make virtual bets on games.

![image](https://github.com/lukarh/NBA-Discord-Bot/assets/65103724/1681a79d-89b2-4517-8d34-eda3cec33b6f)

## Change Log
1.0.0 - Initial Release of NBA Discord Bot. Bot can be ran locally when the user is online with their computer.

1.0.1 - Simplified / Reorganized code in utils.

1.1.0 - Introduced new betting feature, claim-bet feature yet to be implemented.

1.1.1 - Implemented a way for the user to claim their payouts on bets. Fixed bugs with bet inputs and gameStatus not registering correctly.

1.2.0 - Introduced new commands: /process-bets, /current-bets, as well as few other admin commands in case bugs arise that messes up command functionalities. Also fixed bugs related to gameStatus not being read correctly which broke a ton of commands

1.2.1 - Added /bets-leaderboard functionality and activity status to bot, cleaned up a bit of code too.

## Bug List
- To Fix: updateGameMessage, needs to handle multiple message for multiple games

## Available Local Scripts

In the project directory, you can run:

### `node src/index.js`

Runs the bot/file locally, but does not restart the bot automatically when any saved file changes are made in the directory

### `nodemon`

Runs the bot locally and restarts the bot automatically when any saved file changes are made in the directory. This works because package.json has already defined "main": src/index.js

## Not Included 
- .env
  - TOKEN (Access to Bot)
  - GUILD_ID (Server ID)
  - CLIENT_ID 
  - NBA_GAME_CHANNEL_ID (Channel ID to update Game Scores Channel with)
 
- config.json
