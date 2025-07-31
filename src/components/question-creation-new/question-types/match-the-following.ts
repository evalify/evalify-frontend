import { BaseQuestion } from "./base-question";

export interface MatchItem {
  id: string;
  text: string;
}

export interface MatchPair {
  leftPair: string;
  rightPair: string[];
}

export interface MatchTheFollowing extends BaseQuestion {
  keys: MatchItem[];
  values: MatchItem[];
  matchPair: MatchPair[];
}
