var log = ""



const data = [
  {
    url: "https://http/",
    acc: [{
      email: "456@123.com",
      password: "12121212"
    }, {
      email: "789@123.com",
      password: "12121212"
    }, {
      email: "852@123.com",
      password: "12121212"
    }
    ]
  },{
    url: "https://https/",
    acc: [{
      email: "741@369.com",
      password: "2121212"
    }
    ]
  },

]


async function Main() {

  for (let i = 0; i < data.length; i++) {

    index = data[i].url// 网站

    for (j = 0; j < data[i].acc.length; j++) {
      accData = data[i].acc[j]
      email = accData.email// 邮箱
      pwd = accData.password// 密码
      console.log("开始第" + (i + 1) + "个网站第" + (j + 1) + "个账号")
      await fetch(index + "auth/login", {
        method: "post",
        body: "email=" + encodeURIComponent(email) + "&passwd=" + encodeURIComponent(pwd) + "&remember_me=on&code=",
        headers: {
          "Accept": " application/json, text/javascript, */*; q=0.01",
          "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "X-requested-with": "XMLHttpRequest",
          "Origin": index,
          "Referer": index + "auth/login",
          "Accept-encoding": "gzip, deflate, br",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36"
        }
      }).then(res => {
        var cookie = res.headers.get("Set-Cookie")
        console.log(cookie)
        console.log('开始进行签到...\n')
        return fetch(index + "user/checkin", {
          method: "post",
          body: "",
          headers: {
            credentials: "same-origin",
            "Accept": " application/json, text/javascript, */*; q=0.01",
            "X-requested-with": "XMLHttpRequest",
            "Origin": index,
            "Referer": index + "user",
            "Accept-encoding": "gzip, deflate, br",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36",
            "Cookie": getCookie(cookie)
          }
        })
      }).then(res => {
        console.log(res)
        return res.json()
      }).then(res => {
        console.log(res)
        if (res.ret != 1) {
          log += "网址: " + index + " 账号: " + email + " 签到失败   msg=" + res.msg + "\n"
        } else {

          console.log(`${res.msg}\n今日已用：${res.trafficInfo.todayUsedTraffic}\n过去已用：${res.trafficInfo.lastUsedTraffic}\n剩余流量：${res.trafficInfo.unUsedTraffic}\n\n`);
          log += `${res.msg}\n今日已用：${res.trafficInfo.todayUsedTraffic}\n过去已用：${res.trafficInfo.lastUsedTraffic}\n剩余流量：${res.trafficInfo.unUsedTraffic}\n\n`;

        }
      })
      //sleep(3)
      console.log("结束第" + (i + 1) + "个网站第" + (j + 1) + "个账号")
      setTimeout(() => { console.log("waiting") }, 3000);
      //await checkin(index, email, pwd)
    }
  }
  //await sendMsg();
  console.log(log)
  return new Response(await postInfo())
}


function getCookie(cookie) {
  cookie += ";"
  cookie = cookie.split(/[;,]/g)
  var re = []
  var rs = ""
  //console.log(cookie)
  for (i = 0; i < cookie.length; i++) {
    var t = cookie[i]
    //console.log(t)
    if (t.includes("=")) {
      //console.log(t)
      if (!(t.includes("expires") || t.includes("Max-Age") || t.includes("path"))) {
        re.push(cookie[i])
        rs += (cookie[i] + ";")
      }
    }
  }
  console.log(rs, re)


  return rs
}

async function postInfo() {

  return await fetch(
    "https://qmsg.zendee.cn/send/k--e--y?msg=" +
    encodeURIComponent(
      log
        .replaceAll("https://", "")
        .replaceAll("http://", "")
        .replaceAll("@gmail.com", "@谷歌邮箱")
        .replaceAll("@qq.com", "@qq邮箱")
    )
  ).then((res) => {
    return res.text()
  })
}



addEventListener('scheduled', event => {
    event.waitUntil(Main())
})
/*
addEventListener("fetch", (event) => {
  console.clear()
  event.respondWith(
    Main(event.request).catch(
      (err) => new Response(err.stack, { status: 500 })
    )
  );
});
*/
