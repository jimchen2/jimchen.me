import React from 'react';
import { useGlobalColorScheme } from "../config/global";

function NavbarHelper() {
  const { colors } = useGlobalColorScheme();

  return (
    <style type="text/css">
      {`
        .black-text {
          color: ${colors.color_black};
        }
        .custom-search-button {
          background-color: ${colors.color_white};
          color: ${colors.color_blue_2};
          border-color: ${colors.color_blue_1};
        }
        .custom-search-button:hover {
          background-color: ${colors.color_blue_2};
          color: ${colors.color_white};
          border-color: ${colors.color_blue_2};
        }
        .custom-placeholder::placeholder {
          color: ${colors.color_black};
        }
        @media (min-width: 992px) { 
          .navbar-brand-spacing {
            margin-right: 10rem;
          }
        }
      `}
    </style>
  );
}

export default NavbarHelper;