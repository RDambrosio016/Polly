import * as dotenv from 'dotenv'
import PollyClient from './Src/Client';
dotenv.config();

let client = new PollyClient().setup();

