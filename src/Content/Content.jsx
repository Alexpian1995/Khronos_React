import { useContext } from 'react'
import './Content.css'
import { ThemeContext } from '../ThemeContext'



const Content = () => {
   const {DarkTheme} = useContext(ThemeContext)
  return <div className={`content ${DarkTheme && "dark"}`}>
    <div className="row header"></div>
    <div className="row header"></div>

    
  </div>
  
}

export default Content
