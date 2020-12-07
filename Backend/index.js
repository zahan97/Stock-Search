const express = require('express')
const axios = require('axios');
const { response } = require('express');
const cors = require('cors')
const app = express()
const port = 3000

app.use(cors())

app.get('/autocomplete', (req, res) => {
    let symbol = req.query.symbol
    url = "https://api.tiingo.com/tiingo/utilities/search?query=" + symbol + "&token=3090871f96acc492888e8445c53e81ee547c4b02"
    axios.get(url)
        .then(function (response) {
            let temp = response.data
            
            let size = temp.length
            for(let i = 0; i<size; ++i){
                if(temp[i].name == null){
                    temp.splice(i,1)
                    size = size-1
                }
                    
            }
            res.json(temp)
        })
        .catch(function (error) {
            console.log(error);
        })
})

app.get('/compdesc', (req, res) => {
    let symbol = req.query.symbol
    url = "https://api.tiingo.com/tiingo/daily/" + symbol + "?token=3090871f96acc492888e8445c53e81ee547c4b02"
    axios.get(url)
        .then(function (response) {
            res.json(response.data)
        })
        .catch(function (error) {
            res.json({
                "error":"invalid-ticker"
            })
            console.log(error);
        })
})

app.get('/latsp', (req, res) => {
    let symbol = req.query.symbol
    url = "https://api.tiingo.com/iex?tickers=" + symbol + "&token=3090871f96acc492888e8445c53e81ee547c4b02"
    axios.get(url)
        .then(function (response) {
            res.json(response.data)
        })
        .catch(function (error) {
            console.log(error);
        })
})

app.get('/datanow', (req, res) => {
    let symbol = req.query.symbol

    url1 = "https://api.tiingo.com/iex?tickers=" + symbol + "&token=3090871f96acc492888e8445c53e81ee547c4b02"

    let date
    axios.get(url1)
        .then(function (response) {
            date = response.data[0].timestamp
            date = date.substring(0,10)
            url = "https://api.tiingo.com/iex/" + symbol + "/prices?startDate=" + date + "&resampleFreq=4min" + "&token=3090871f96acc492888e8445c53e81ee547c4b02"
            
            axios.get(url)
                .then(function (response) {
                    let d = response.data
                    let daily = []
                    for(let i = 0; i<d.length; ++i) {
                        let year = Number(d[i].date.substring(0,4))
                        let month = Number(d[i].date.substring(5,7)) - 1
                        let day = Number(d[i].date.substring(8,10))
                        let hour = 0
                        if(month >= 10)
                            hour = Number(d[i].date.substring(11,13)) - 8
                        else
                            hour = Number(d[i].date.substring(11,13)) - 7
                        let minute = Number(d[i].date.substring(14,16))
                        let temp = []
                        temp.push(Date.UTC(year, month, day, hour, minute))
                        temp.push(d[i].close)
                        daily.push(temp)
                    }
                    res.json({
                        'daily':daily
                    })
                })
            .catch(function (error) {
                console.log(error);
            })
        })
        .catch(function (error) {
            console.log(error);
        })
})

app.get('/dataold', (req, res) => {
    let symbol = req.query.symbol

    url1 = "https://api.tiingo.com/iex?tickers=" + symbol + "&token=3090871f96acc492888e8445c53e81ee547c4b02"

    let date
    axios.get(url1)
        .then(function (response) {
            date = response.data[0].timestamp
            date = date.substring(0,10)
            newdate = (Number(date.substring(0,4)) - 2).toString() + date.substring(4)
            
            url = "https://api.tiingo.com/iex/" + symbol + "/prices?startDate=" + newdate + "&resampleFreq=12hour&columns=open,high,low,close,volume" + "&token=3090871f96acc492888e8445c53e81ee547c4b02"
            
            axios.get(url)
                .then(function (response) {
                    let d = response.data
                    let ohlc = []
                    let vol = []
                    for(let i = 0; i<d.length; ++i) {
                        let year = Number(d[i].date.substring(0,4))
                        let month = Number(d[i].date.substring(5,7)) - 1
                        let day = Number(d[i].date.substring(8,10))
                        let hour = 0
                        if(month >= 10)
                            hour = Number(d[i].date.substring(11,13)) - 8
                        else
                            hour = Number(d[i].date.substring(11,13)) - 7
                        let minute = Number(d[i].date.substring(14,16))
                        let temp = []
                        temp.push(Date.UTC(year, month, day, hour, minute))
                        temp.push(d[i].open)
                        temp.push(d[i].high)
                        temp.push(d[i].low)
                        temp.push(d[i].close)
                        ohlc.push(temp)

                        let temp2 = []
                        temp2.push(Date.UTC(year, month, day, hour, minute))
                        temp2.push(d[i].volume)
                        vol.push(temp2)
                    }

                    res.json({
                        'ohlc':ohlc,
                        'volume':vol
                    })
                })
            .catch(function (error) {
                console.log(error);
            })
        })
        .catch(function (error) {
            console.log(error);
        })
})


app.get('/news', (req, res) => {
    let symbol = req.query.symbol
    url = "https://newsapi.org/v2/everything?apiKey=" + '467b0ed73831477bad136218f85bf607' + "&q=" + symbol + '&pageSize=20'
    axios.get(url)
        .then(function (response) {
            const month = {
                '01':'January',
                '02':'February',
                '03':'March',
                '04':'April',
                '05':'May',
                '06':'June',
                '07':'July',
                '08':'August',
                '09':'September',
                '10':'October',
                '11':'November',
                '12':'December'
            }
            let at = response.data.articles

            for(let i = 0; i<at.length; ++i){
                let d = at[i].publishedAt
                let day = d.substring(8,10)
                let year = d.substring(0,4)
                let mot = d.substring(5,7)

                let final_date = month[mot] + ' ' + day + ', ' + year
                
                at[i].publishedAt = final_date
            }

            res.json({
                news : at
            })
        })
        .catch(function (error) {
            console.log(error);
        })
})

app.listen(port, () => {
  console.log(`Listening`)
})
