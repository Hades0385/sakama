const { EmbedBuilder } = require('discord.js');
const axios = require('axios')

const MOE_API = process.env.MOE_API

module.exports = {
  name: "uvi",
  aliases: ["uv","u"],
  run: async (message, args) => {
    axios
    .get(`https://data.moenv.gov.tw/api/v2/uv_s_01?language=zh&limit=14&api_key=${MOE_API}`)
    .then(response => {
      apiData = response.data.records
      // console.log(apiData)
      let ad = apiData[uvisite()]
      let dataTime = ad.datacreationdate
      let sitename = ad.sitename
      let county = ad.county
      let uvi = ad.uvi
      let uvilv = uvilevel(uvi)
      let sg = suggestion[uvilv]

      const nowembed = new EmbedBuilder()
        .setColor(`${color[uvilv]}`)
        .setAuthor({ name: '紫外線資訊', iconURL: 'https://upload.wikimedia.org/wikipedia/zh/thumb/e/e4/ROC_Ministry_of_Environment_Seal.svg/150px-ROC_Ministry_of_Environment_Seal.svg.png'})
        .setTitle(`${county}/${sitename}`)
        .setDescription(`${dataTime}`)
        .addFields(
          { name: 'UVI', value: `${uvi}`,inline: true},
          { name: '等級', value: `${uvilv}`,inline: true},
          { name: '建議', value: `${sg}`,inline: false},
        )
        .setTimestamp()
        .setFooter({ text: '環境部開放資料'});

      message.reply({ embeds: [nowembed] });
    }).catch(err => {
        const siteembed = new EmbedBuilder()
        .setColor(`#ca0034`)
        .setAuthor({ name: '無法取得資訊,請檢查輸入是否正確'})
        .addFields(
          { name: '可查詢縣市', value: `嘉義縣、屏東縣、高雄市、臺南市、雲林縣、南投縣、彰化縣、臺中市、苗栗縣、桃園市、新北市`,inline: true},
        )
        message.reply({ embeds: [siteembed] });
        console.log(err)
    })

    function uvisite() {
      for(var i = 0 ;i < 14 ; i++ ){
        if (args == apiData[i].county){
          if (apiData[i].county === '新北市'){
            return 13
          }else{
          return i
        }
        }
      }
    };
    
  },
};
const color = {
  "低量級" : '#009865',
  "中量級" : '#fffb26',
  "高量級" : '#ff9835',
  "過量級" : '#ca0034',
  "危險級" : '#670099',
}

const suggestion = {
  "低量級" : '不需要任何防護保護 ',
  "中量級" : '帽子/陽傘+防曬液+太陽眼鏡+儘量待在陰涼處. ',
  "高量級" : '30分鐘內可能曬傷\n帽子/陽傘+防曬液+太陽眼鏡+儘量待在陰涼處. ',
  "過量級" : '20分鐘內可能曬傷\n帽子/陽傘+防曬液+太陽眼鏡+陰涼處+長袖衣物+上午十時至下午二時最好不外出.',
  "危險級" : '10分鐘內可能曬傷\n帽子/陽傘+防曬液+太陽眼鏡+陰涼處+長袖衣物+上午十時至下午二時最好不外出.',
}

function uvilevel(uvi) {
  if (uvi<=2) {
    let level = "低量級";
    return level
  }else if (uvi<=5){
    let level = "中量級";
    return level
  }else if (uvi<=7){
    let level = "高量級";
    return level
  }else if (uvi<=10){
    let level = "過量級";
    return level
  }else{
    let level = "危險級";
    return level
  }
}