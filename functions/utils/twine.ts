import * as htmlparser2 from 'htmlparser2';
import { existsOne } from 'domutils';

export const isValidTwee = (str: string) => {
  const trimmed = str.trim();
  const firstLineEnd = trimmed.indexOf('\n');
  if (firstLineEnd === -1) return false;

  // Can we make this more sophisticated?
  return trimmed.substring(0, 3) === ':: ';
};

export const isValidTwineHtml = (str: string) => {
  const dom = htmlparser2.parseDocument(str);
  return existsOne((el) => el.type === 'tag' && el.name === 'tw-storydata', dom.children);
};