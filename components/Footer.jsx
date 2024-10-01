import React from "react";
import { AiFillInstagram, AiOutlineTwitter, AiFillCopyrightCircle } from "react-icons/ai";

const Footer = () => {
  return (
    <div className="footer-container">
      <p>
        2023 Flipzon <AiFillCopyrightCircle />{" "}
      </p>
      <p className="icons">
        <AiFillInstagram />
        <AiOutlineTwitter />
      </p>
    </div>
  );
};

export default Footer;
