import React, { Component } from 'react';

class Locations extends Component {
  constructor(props) {
    super(props);
    this.updateQuery = this.updateQuery.bind(this);
  }

  updateQuery =(query) => {
    this.props.filterPlaces(query);
  } 

  render() {
  	return (
      <div className="plces-list">
        <input className="search" 
               role="search" 
               type='text'
               value={this.props.query}
               placeholder='filter:'
               onChange={(event) => this.updateQuery(event.target.value)}
        />
        <ul className="places">
          {this.props.filteredLocations.map((location) => 
            <li
              className="location-item"
              tabIndex={0}
              aria-label={location.name}
              role="button"
              key={location.key}
              onClick={() => this.props.onItemClick( location)}
              onKeyPress={() => this.props.onItemClick( location)}
            >
            {location.name}
            </li>
          )}
        </ul>
      </div>
    );
  }
}

export default Locations;