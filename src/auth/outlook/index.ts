import * as readline from 'readline-sync';
import { DeviceCodeInfo } from '@azure/identity';
import { Message } from '@microsoft/microsoft-graph-types';

import settings, { AppSettings } from './appSettings';
import * as graphHelper from './graphHelper';

export async function main() {
  initializeGraph(settings);

  await greetUserAsync();
  await displayAccessTokenAsync();
}

// main();
function initializeGraph(settings: AppSettings) {
  graphHelper.initializeGraphForUserAuth(settings, (info: DeviceCodeInfo) => {
  });
}

async function greetUserAsync() {
  try {
    const user = await graphHelper.getUserAsync();
    // For Work/school accounts, email is in mail property
    // Personal accounts, email is in userPrincipalName
  } catch (err) {
  }
}

async function displayAccessTokenAsync() {
  try {
    const userToken = await graphHelper.getUserTokenAsync();
  } catch (err) {
  }
}
