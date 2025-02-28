
import './App.css';
import UilReact from '@iconscout/react-unicons/icons/uil-react'
import TopButtons from './Components/TopButtons';
import Inputes from './Components/Inputes';
import TimeAndLocation from './Components/TimeAndLocation';
import TamperatureAndDetails from './Components/TamperatureAndDetails';
import Forcast from './Components/Forcast';
import getFormatedWeatherdata from './Servicess/WeatherServices';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
const[quary,setQuery]=useState({q:'kolkata'});
const[units,setUnits]=useState('metric');
const[weather,setWeather]=useState(null);
useEffect(()=>{
  const fetchWeather=async()=>{
    const message=quary.q? quary.q:'current location'
    toast.info("Fetching Weather for "+message)
    await getFormatedWeatherdata({...quary,units})
    .then((data)=>{
      toast.success(`Successfully fetched weather for ${data.name},${data.country}`)
      console.log(data);
      setWeather(data)
    })
   }
fetchWeather()
},[quary,units])

const formatBackgrounf=()=>{
  if(!weather) return 'from-cyan-700 to-blue-700'
  const threshold=units==='metric'?20:60
  if(weather.temp<=threshold) return 'from-cyan-700 to-blue-700'
  return 'from-yellow-700 to-orange-700'
}
  return (
    <div className={`mx-auto max-w-screen-md mt-4 py-5 px-32 bg-gradient-to-br h-fit shadow-xl shadow-gray-400 ${formatBackgrounf()}`}>
      <TopButtons setQuery={setQuery}/>
      <Inputes setQuery={setQuery} units={units} setUnits={setUnits}/>
      {weather &&(
        <div>
          <TimeAndLocation weather={weather}/>
          <TamperatureAndDetails weather={weather}/>

          <Forcast title="hourly forecast" items={weather.hourly}/>
          <Forcast title="daily forecast" items={weather.daily}/>
        </div>
      )}
      <ToastContainer autoClose={5000} theme='colored' newestOnTop={true} />
    </div>
  );
}

export default App;
