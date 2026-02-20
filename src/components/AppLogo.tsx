import React from 'react';
import Svg, { Path } from 'react-native-svg';

export const AppLogo: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <Path d="M6 12h36v24H6z" fill="#2B6CB0" />
    <Path d="M12 18h24v12H12z" fill="#90CDF4" />
  </Svg>
);

export default AppLogo;
