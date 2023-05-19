
# NBA Discord Bot

[The NBA Discord Bot](https://github.com/lukarh/NBA-Discord-Bot) is a [Discord](https://discord.com/) [Bot](https://discord.com/developers/docs/intro) developed by me, Lukar! It began as a fun little project for personal use on my own Discord Server since I typically host NBA Watch Partys there and wanted a way for everyone to easily access NBA stats / schedule without having to go to an application or different website. Also, I'm a huge NBA Fan and I enjoy learning to work with code and data, so I thought to endeavor on this cool little project. A much more fleshed out version of the NBA Discord Bot can be found [here](https://github.com/NBABot-Development-Team/NBABot). File Structure is inspired by [Under Ctrl](https://www.youtube.com/watch?v=JEEcbVjLyr0) and the assets directory was inspired by the [NBA Discord Bot](https://github.com/NBABot-Development-Team/NBABot). 

## Available Local Scripts

In the project directory, you can run:

### `node src/index.js`

Runs the bot/file locally, but does not restart the bot automatically when any saved file changes are made in the directory

### `nodemon`

Runs the bot locally and restarts the bot automatically when any saved file changes are made in the directory. This works because package.json has already defined "main": src/index.js

## Current Features on Version 1.0.1

- Automatic Features
  - sendDailyScoreMessage.js: Sends a new message to the NBA Live Games Channel every 24 hours
![image](https://github.com/lukarh/NBA-Discord-Bot/assets/65103724/5f154374-b45d-4f0e-980d-0bab01e88f1b)
  - updateGameMessage.js: Updates the latest message in the NBA Live Games Channel with score updates every so often
![image](https://github.com/lukarh/NBA-Discord-Bot/assets/65103724/7d580fc2-5492-4229-90e5-b061e5b49049)

## Change Log
1.0.0 - Initial Release of NBA Discord Bot. Bot can be ran locally when the user is online with their computer.

1.0.1 - Simplified / Reorganized code.
