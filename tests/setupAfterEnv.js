import { configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

// We are using react 17 (and react-dom 17), so we need to use
// this 3rd party adapter for enzyme

configure({ adapter: new Adapter() });