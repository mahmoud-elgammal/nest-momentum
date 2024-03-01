import styled from 'styled-components';

import { Route, Routes, Link } from 'react-router-dom';

import { shared } from 'shared';

const StyledApp = styled.div`
  // Your style here
`;

export function App() {
  return <StyledApp>Helo {shared()}!</StyledApp>;
}

export default App;
