
import * as fs from 'fs';

export async function getRootPath(path: string): Promise<string | undefined> {
  if(path) {
    const rootPath = await isRootPath(path);

    if(rootPath) { 
      return rootPath;
    };

    const prePath = getPreviousPath(path);

    if(prePath) {
      const result = await getRootPath(prePath);

      return result;
    }
  }
}

async function isRootPath(path: string, rootName = 'package.json') {
  const dir = await fs.promises.readdir(path);

  if(dir.includes(rootName)) {
    return path;
  }

  return false;
}

function getPreviousPath(path: string) {
  const splitPath = path.split('/');

  if(splitPath.length === 1) {
    return '';
  }

  return splitPath.slice(0, splitPath.length - 1).join('/');
}