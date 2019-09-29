import React, { Component } from "react";
import * as $ from "jquery";
import "./App.css";
import styled from 'styled-components';

// Authorization details
const authEndpoint = "https://accounts.spotify.com/authorize";
const clientId = "3f322219c8164f2b92c4566570e2fe55";
const redirectUri = "http://localhost:3000";
const scopes = [
    "user-top-read",
    "user-read-currently-playing",
    "user-read-playback-state",
];


class App extends Component {
  constructor() {
    super();
    this.state = {
      token: null,
      top_items: {},
    };
    this.getTopTrack = this.getTopTrack.bind(this);
    this.getTopArtist = this.getTopArtist.bind(this);
  }

  // Adapted from Spotify web-api-auth-examples: https://github.com/spotify/web-api-auth-examples
  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
      }
    return hashParams;
  }

  componentDidMount() {
    // Set token
    // let _token = hash.access_token;
    let _token = this.getHashParams().access_token

    if (_token) {
      // Set token
      this.setState({
        token: _token
      });
      this.getTopTrack(_token);
      this.getTopArtist(_token);
    }
  }

  getTopTrack(access_token) {
    // Make a call using the token
    $.ajax({
      url: "https://api.spotify.com/v1/me/top/tracks",
      type: "GET",
      headers: {
                  'Authorization': 'Bearer ' + access_token
                },
      success: (data) => {
        console.log("top track data", data);
        this.setState({
          top_items: data.items,
          top_item: data.items[0],
          top_name: data.items[0].name,
          top_art: data.items[0].album.images[0].url,
          progress_ms: data.progress_ms,
        });
      }
    });
  }

  getTopArtist(access_token) {
    $.ajax({
      url: "https://api.spotify.com/v1/me/top/artists",
      type: "GET",
      headers: {
                  'Authorization': 'Bearer ' + access_token
                },
      success: (data) => {
        console.log("top artist data", data);
        this.setState({
          top_artists: data.items,
          top_artist: data.items[0],
          top_artistname: data.items[0].name,
          top_artistimage: data.items[0].images[0].url,
          top_artisturi: data.items[0].uri
        });
      }
    });
  }

  render() {
    const Title = styled.h1`
      font-size: 30px;
    `;

    const Wrapper = styled.div
    `
      color: pink;
    `;

    const AlbumImage = styled.img
    `
      width: 70%;
      padding: 1%;
      align: middle;
    `;

    const Section = styled.div
    `
      padding: 10px 10px;
      font-size: 20px;
    `;

    const Button = styled.button`

    `;

    const LoginButton = styled.button
    `
      color: pink;
      font-size: 30px;
      display: inline-block;
      font-size: 1em;
      margin: 1em;
      padding: 0.25em 1em;
      border: 2px solid pink;
      border-radius: 3px;
      display: block;
      background-color: inherit;
      cursor: pointer;
    `;

    const LoginLink = styled.a
    `
      text-decoration: none;
      cursor: pointer;
    `

    return (
      <div className="App">
        <header className="App-header">
          {!this.state.token && (
            <LoginLink
              className="btn btn--loginApp-link"
              href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
                "%20"
              )}&response_type=token&show_dialog=true`}
            >
              <LoginButton>Login to Spotify</LoginButton>
            </LoginLink>
          )}

          <Wrapper>
            {this.state.token && (

            <Section>
              <Title>Analyze your listening!</Title>
              Top song: {this.state.top_name}<br/>
              <AlbumImage src={this.state.top_art}/>
            </Section>
          )}

          {this.state.token && (
            <Section>
              Top artist: {this.state.top_artistname}<br/>
              <AlbumImage src={this.state.top_artistimage}/>
            </Section>
          )}

          </Wrapper>

        </header>
      </div>
    );
  }
}

export default App;
