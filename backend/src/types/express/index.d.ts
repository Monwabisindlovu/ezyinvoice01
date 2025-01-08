import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any; // Define the `user` property to hold the decoded JWT user info
    }
  }
}
