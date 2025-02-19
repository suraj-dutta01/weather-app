import {DateTime} from "luxon"
const API_KEY="Use your own api key";
const BASE_URL="https://api.openweathermap.org/data/2.5"
const ONE_CALL_URL="https://api.openweathermap.org/data/3.0"
 //"https://api.openweathermap.org/data/3.0/onecall?lat=12.987138&lon=77.624818&exclude=current,minutely,alerts&appid=6d6c31da1edba5d5bd9b5045bd02dc5d"


const getWeatherData= (infoType,searchParams)=>{
    const url=new URL(BASE_URL+'/'+infoType);
    url.search=new URLSearchParams({...searchParams, appid:API_KEY})

    return fetch(url).then((res)=> res.json())
}

const getWeatherDataOne= (infoType,searchParams)=>{
    const url=new URL(ONE_CALL_URL+'/'+infoType);
    url.search=new URLSearchParams({...searchParams, appid:API_KEY})

    return fetch(url).then((res)=> res.json())
}


const formatCurrentWeather=(data)=>{
     const{
        coord:{lat,lon},
        main:{temp,feels_like,temp_max,temp_min,humidity},
        name,
        dt,
        sys:{country,sunrise,sunset},
        weather,
        wind:{speed}
          }=data
     const {main:details,icon}=weather[0];     
    return{lat,lon,temp,feels_like,temp_max,temp_min,humidity,name,dt,country,sunrise,sunset,details,icon,speed}
}
 const formatForecastWeather=(data)=>{
     let { timezone,daily,hourly}=data
     daily=daily.slice(1,6).map((d)=>{
        return{
            title:formatToLocalTime(d.dt,timezone,"ccc"),
            temp: d.temp.day,
            icon:d.weather[0].icon
        }
     })


     hourly=hourly.slice(1,6).map((d)=>{
        return{
            title:formatToLocalTime(d.dt,timezone,"hh:mm a"),
            temp: d.temp,
            icon:d.weather[0].icon
        }
     })
     return {timezone,daily,hourly}
}
const getFormatedWeatherdata=async (searchParams)=>{
    const formatedCurrentWeather= await getWeatherData("weather",searchParams).then(formatCurrentWeather)
    
    const{lat,lon}=formatedCurrentWeather
    const formatedForecastWeather=await getWeatherDataOne('onecall',{ 
        lat, lon, exclude: 'current,minutely,alerts', units:searchParams.units}).then(formatForecastWeather)

    return {...formatedCurrentWeather , ...formatedForecastWeather};
}

const formatToLocalTime=(secs,zone,
    format="cccc, dd LLL yyyy' | Local Time: 'hh:mm a"
    )=> DateTime.fromSeconds(secs).setZone(zone).toFormat(format)
const iconUrlFromCode=(code)=>`http://openweathermap.org/img/wn/${code}@2x.png`

export default getFormatedWeatherdata;
export {formatToLocalTime,iconUrlFromCode}
