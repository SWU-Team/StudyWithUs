import React, { useState } from "react";
import { Link } from "react-router-dom";

function Startpage() {
  return (
    <div>
      <h1>start page</h1>
      <Link to="/Login">로그인</Link>
    </div>
  );
}

export default Startpage;
