<script>
    import { getUserStat, getUserDiscord, getInventory} from "$lib/remote/functions.remote";
    import { json } from "@sveltejs/kit";
    let dbStats = await getUserStat();
    let userDiscord = await getUserDiscord();
    let userInventory =await getInventory();

    console.log(userInventory)

    
    
    let results = JSON.stringify([dbStats, userDiscord, userInventory])
    
    
</script>

{results}

<!-- [{"id":"955695820999639120","coins":"100000","energy":"54","energy_max":"100","mood_max":"100","mood":"100"},{"id":"955695820999639120","bot":false,"system":false,"flags":4194368,"username":"youngcoder45","globalName":"Aditya ✧ YC45","discriminator":"0","avatar":"cf296ec1b2af5b10746bb89dbd24fc38","avatarDecoration":null,"avatarDecorationData":{"asset":"a_d3da36040163ee0f9176dfe7ced45cdc","skuId":"1144058522808614923"},"collectibles":null,"primaryGuild":{"identityGuildId":"1263067254153805905","identityEnabled":true,"tag":"CODE","badge":"04cee49fbcaa69a71206ccb637470e72"},"createdTimestamp":1647926039696,"defaultAvatarURL":"https://cdn.discordapp.com/embed/avatars/2.png","tag":"youngcoder45","avatarURL":"https://cdn.discordapp.com/avatars/955695820999639120/cf296ec1b2af5b10746bb89dbd24fc38.webp","displayAvatarURL":"https://cdn.discordapp.com/avatars/955695820999639120/cf296ec1b2af5b10746bb89dbd24fc38.webp","guildTagBadgeURL":"https://cdn.discordapp.com/guild-tag-badges/1263067254153805905/04cee49fbcaa69a71206ccb637470e72.webp"},[{"id":"955695820999639120","item_id":1,"quantity":110},{"id":"955695820999639120","item_id":2,"quantity":0},{"id":"955695820999639120","item_id":3,"quantity":0},{"id":"955695820999639120","item_id":4,"quantity":52},{"id":"955695820999639120","item_id":5,"quantity":0},{"id":"955695820999639120","item_id":6,"quantity":0},{"id":"955695820999639120","item_id":7,"quantity":0},{"id":"955695820999639120","item_id":8,"quantity":444},{"id":"955695820999639120","item_id":9,"quantity":0},{"id":"955695820999639120","item_id":10,"quantity":0},{"id":"955695820999639120","item_id":11,"quantity":0},{"id":"955695820999639120","item_id":12,"quantity":0},{"id":"955695820999639120","item_id":13,"quantity":0},{"id":"955695820999639120","item_id":14,"quantity":5},{"id":"955695820999639120","item_id":15,"quantity":0},{"id":"955695820999639120","item_id":16,"quantity":0},{"id":"955695820999639120","item_id":17,"quantity":0},{"id":"955695820999639120","item_id":18,"quantity":0},{"id":"955695820999639120","item_id":26,"quantity":0}]] -->




