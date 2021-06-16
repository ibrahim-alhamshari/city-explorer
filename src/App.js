import React, { Component } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Alert from 'react-bootstrap/Alert';
import Image from 'react-bootstrap/Image';



export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cityName: '',
      cityData: {},
      displayData: false,
      error: '',
      message: 'please',
      alert: false,
      weatherData: '',
      lat: '',
      lon: '',
      movieData: '',
    };
  }

  updateCityName = (e) => {
    this.setState({
      cityName: e.target.value,
    });
    console.log(this.state.cityName);
  }

  getAPIData = async (e) => {
    e.preventDefault();
    try{
      await axios.get(`https://us1.locationiq.com/v1/search.php?key=pk.00d7cd872eadb75fc70c28a8fb0a50b5&q=${this.state.cityName}&format=json`).then(axiosResponse =>{
       
        this.setState({
          cityData: axiosResponse.data[0],
          lat: axiosResponse.data[0].lat,
          lon: axiosResponse.data[0].lon,
        });

      });
   
      axios.get(`${process.env.REACT_APP_URL}/weather-data?lat=${this.state.lat}&lon=${this.state.lon}`).then(myApiRe=>{
        this.setState({
          weatherData: myApiRe.data,
          displayData: true,
        });
      });

      axios.get(`${process.env.REACT_APP_URL}/movie?cityName=${this.state.cityName}`).then(movieResponse =>{
        this.setState({
          movieData: movieResponse.data,
        });
        console.log(this.state.movieData);
      });
     
    }catch(error){
      this.setState({
        error: error.message,
        alert : true,
      });
    }
  }

  render() {
    return (
      <div>
        {this.state.alert &&
        <Alert variant="danger">
        This is a {this.state.error} alert-check it out!
        </Alert>

        }
        <h2>City Explorer</h2>
        <form onSubmit={this.getAPIData}>
          <label>City name</label>
          <input type="text" onChange={this.updateCityName} />
          <br></br>
          <br></br>
          <input type="submit" value="Explore!" id="submitId" />
        </form>
        {/*Conditional Render */}
        {this.state.displayData &&
        
        <div>
          console.log(this.state.movieData);
          <p>{this.state.cityData.display_name}</p>
          {/* <img src={`https://maps.locationiq.com/v3/staticmap?key=pk.d36871f015649f915282f374cff76628&q&center=${this.state.cityData.lat},${this.state.cityData.lon}&zoom=15`} alt='' /> */}
          <Image src={`https://maps.locationiq.com/v3/staticmap?key=pk.d36871f015649f915282f374cff76628&q&center=${this.state.cityData.lat},${this.state.cityData.lon}&zoom=15`} alt='' />
          { this.state.weatherData.map(value =>{
            return(
              <>
                <ul class="list-group">
                  <li class="list-group-item">
                    <p>{value.description}</p>
                    <p>{value.date}</p>
                  </li>
                </ul>
              </>
            );
          },
          )
          }

          {this.state.movieData.map(value=>{
            return(
              <ul id="movieElements">
                <Image src={`https://image.tmdb.org/t/p/w500${value.poster_path}`} alt={value.title} />
                <p>title: {value.title} </p>
                <p>overview: {value.overview}</p>
                <p>average_votes: {value.vote_average}</p>
                <p>total_votes: {value.vote_count}</p>
                <p>popularity: {value.popularity}</p>
                <p>released_on: {value.release_date}</p>
              </ul>
            );
          })
          }
        
        </div>
        }
      </div>
      
    );
  }
}

export default App;