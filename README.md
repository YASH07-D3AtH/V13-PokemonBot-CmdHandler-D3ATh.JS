# V13-PokemonBot-CmdHandler-D3ATh.JS
Discord.Js V13 pokemon bot command handler with Slash command support! Spawn and models already coded . This handler is made for my youtube pokemon bot series. 
Check out my youtube : https://www.youtube.com/channel/UCQeIkcv_dxRhNb1742oaIAw

# 🚨 Requirements
1. Node.js v16 or higher
2. Discord V13
3. Configure yourself in `config.json` and `events/ready.js`
4. `npm i` in console
5. Start the bot with `node index.js`

# 🖥️ How to enable Slash Commands?
They are already enabled by default. You just need to to select Bot & Application.commands scope while inviting your bot!

Point to be noted : You need to either add your guild id in handlers/index.js/47  - Using specific guild will take 0 time for slash commands to load (in that specific guild) whereas if you select the option for all guilds to be registered with slash commands , you would have to wait around 60 mins !

# ❗ Configure 

First of all , fill up the **config.json** file with required details: 
```
{
   "token": "BOT_TOKEN_HERE",
    "prefix": "p!",
    "owners": [
        "OWNER ID 1",
       "OWNER Id 2"
       ]
}        

```

Second is mongoose details, fill up your mongo db details in events/ready.js/12. You can get these details from https://www.mongodb.com/cloud/atlas

# 🎀 Support
If you're having any problem with these codes/handler, join my support server: https://discord.gg/khFV7Z6h8k
