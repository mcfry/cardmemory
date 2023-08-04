import React from "react";
import "./About.css";

const About = () => (
    <div className="d-flex flex-column justify-content-center align-items-center bg-light flex-grow-1">
      <h2 className="home-fs font-weight-bold pb-3">About</h2>
      <p className="text-center w-50">This application was built with:</p>
      <ul className="list-inline">
          <li className="list-inline-item">Decoupled Rails API,</li>
          <li className="list-inline-item">PostgreSQL,</li>
          <li className="list-inline-item">Devise (users),</li>
          <li className="list-inline-item">React,</li>
          <li className="list-inline-item">MobX,</li>
          <li className="list-inline-item">Three.js (panorama),</li>
          <li className="list-inline-item">and Bootstrap</li>
      </ul>
    </div>
);

export default About;
