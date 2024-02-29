import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import ParticlesBg from 'particles-bg';

const setupClarifai = (imageUrl) => {
  const PAT = 'd74361b61080448c8a870a006a99fdf7';
  const USER_ID = 'taras-klimenko';
  const APP_ID = 'In-vision-app';
  const IMAGE_URL = imageUrl;

  const raw = JSON.stringify({
    user_app_id: {
      user_id: USER_ID,
      app_id: APP_ID,
    },
    inputs: [
      {
        data: {
          image: {
            url: IMAGE_URL,
          },
        },
      },
    ],
  });

  const requestOptions = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: 'Key ' + PAT,
    },
    body: raw,
  };
  return requestOptions;
};

const initialState = {
  input: '',
  imageURL: '',
  box: {},
  route: 'signIn',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: '',
  },
};

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined,
      },
    });
  };

  calculateFaceLocation = (data) => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('image');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftColumn: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightColumn: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height,
    };
  };

  onRouteChange = (route) => {
    if (route === 'signOut') {
      this.setState(initialState);
    } else if (route === 'home') {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({ box: box });
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onPictureSubmit = () => {
    this.setState({ imageURL: this.state.input });
    fetch(
      `https://api.clarifai.com/v2/models/face-detection/outputs`,
      setupClarifai(this.state.input)
    )
      .then((response) => response.json())
      .then((result) => {
        if (result) {
          fetch('http://localhost:3001/image', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: this.state.user.id }),
          })
            .then((response) => response.json())
            .then((count) =>
              this.setState(Object.assign(this.state.user, { entries: count }))
            );
        }
        this.displayFaceBox(this.calculateFaceLocation(result));
      })
      .catch((error) => console.log('error', error));
  };

  render() {
    return (
      <div className="App">
        <ParticlesBg type="cobweb" bg={true} color="#ffffff" />
        <Navigation
          isSignedIn={this.state.isSignedIn}
          onRouteChange={this.onRouteChange}
        />
        {this.state.route === 'home' ? (
          <>
            <Logo />
            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onPictureSubmit={this.onPictureSubmit}
            />
            <FaceRecognition
              imageURL={this.state.imageURL}
              box={this.state.box}
            />
          </>
        ) : this.state.route === 'signIn' ? (
          <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
        ) : (
          <Register
            onRouteChange={this.onRouteChange}
            loadUser={this.loadUser}
          />
        )}
      </div>
    );
  }
}

export default App;
