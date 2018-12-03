import React, { Component } from "react";
import { Link } from "react-router-dom";

class Landing extends Component {
  render() {
    return (
      <div className="landing">
        <div className="dark-overlay landing-inner text-light">
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center">
                <h1 className="display-3 mb-4">DevIn</h1>
                <p className="lead">
                  {" "}
                  A social network for developers to create and share their
                  portfolios with other developers.
                </p>
                <hr />
                <Link exact to="/register" className="btn btn-lg btn-info mr-2">
                  Sign Up
                </Link>
                <Link exact to="/login" className="btn btn-lg btn-light">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Landing;
