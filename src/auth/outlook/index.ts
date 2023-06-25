import * as readline from 'readline-sync';
import { DeviceCodeInfo } from '@azure/identity';
import { Message } from '@microsoft/microsoft-graph-types';

import settings, { AppSettings } from './appSettings';
import * as graphHelper from './graphHelper';

export async function main() {
  console.log('TypeScript Graph Tutorial');
  initializeGraph(settings);

  await greetUserAsync();
  await displayAccessTokenAsync();
}

// main();
function initializeGraph(settings: AppSettings) {
  graphHelper.initializeGraphForUserAuth(settings, (info: DeviceCodeInfo) => {
    console.log(info.message);
  });
}

async function greetUserAsync() {
  try {
    const user = await graphHelper.getUserAsync();
    console.log(`Hello, ${user?.displayName}!`);
    // For Work/school accounts, email is in mail property
    // Personal accounts, email is in userPrincipalName
    console.log(`Email: ${user?.mail ?? user?.userPrincipalName ?? ''}`);
  } catch (err) {
    console.log(`Error getting user: ${err}`);
  }
}

async function displayAccessTokenAsync() {
  try {
    const userToken = await graphHelper.getUserTokenAsync();
    console.log(`User token: ${userToken}`);
  } catch (err) {
    console.log(`Error getting user access token: ${err}`);
  }
}
