import { Map, InfoWindow, Marker } from 'google-maps-react';
import React, { Component } from 'react';
import './App.css';

class MyMap extends Component {
 
  render() {
    return(
      <Map 
        className={"map"}
        google={this.props.google}
        onClick = {this.props.onMapclicked}
        initialCenter = {{lat: 45.899214, lng: 15.947406 }}
        zoom={ 12 }
      >
        {this.props.locations.map(location =>
          <Marker
          	onClick={this.props.onMarkerClick}
          	key={location.key}
          	id={location.id}
          	title={location.key}
          	type={location.type}
          	name={location.name}
          	position={location.location}
            animation={0}
          	address={location.address}
            ref={this.props.addMarker}
          />
        )}
        <InfoWindow 
          position={{lat: parseFloat(this.props.infoWindowPlace.lat)+0.008, lng: parseFloat(this.props.infoWindowPlace.lng)}}
          visible={this.props.showInfoWindow}
          onClose={this.props.closeInfoWindow}>
          <div className="info"
               role="Dialog">
            <p className="title"
               tabIndex="0">
              {this.props.selectedPlace.name}
            </p>
            <p tabIndex="0">
              <span>Type:</span>{" "}
                {!this.props.selectedPlace.type
                 ? "N/A"
                 : this.props.selectedPlace.type}
            </p>
            <p tabIndex="0">
              <span>Address:</span>{" "}
                {!this.props.selectedPlace.address
                 ? "N/A"
                 : this.props.selectedPlace.address}
            </p>
          </div> 
        </InfoWindow>
      </Map>
    );
  }
}

export default MyMap;