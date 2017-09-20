import req from 'request';
import { parseString } from 'xml2js';
import fs from 'fs';
import unzip from 'unzip';
import http from 'http';

export default { search, download };

const API_HOST = "http://thetvdb.com";
const KEY = process.env.THETVDB_API_KEY;

function search(q, cb) {
  const url = `${API_HOST}/api/GetSeries.php?seriesname=${q}`;

  get(url, (res) => {
    cb((res['Data']['Series'] || []).map(i => {
      const out = {
        id: i.id[0],
        name: i.SeriesName[0],
        overview: (i.Overview || [])[0] || 'No Overview'
      };
      if (i.banner) {
        out.banner = `${API_HOST}/banners/${i.banner[0]}`;
      }
      return out;
    }));
  });
}

function get(url, cb) {
  req(url, (err, resp, body) => {
    if (err) throw `Error while req ${url}: ${err}`;
    if (resp.statusCode != 200) throw `Error while req ${url}: code — ${resp.statusCode}`;

    parseString(body, (err, res) => {
      if (err) throw `Error parsing response from ${url}: ${err}`;
      cb(res);
    });
  });
}

function download(id, to, cb) {
  const zip_url = `${API_HOST}/api/${KEY}/series/${id}/all/en.zip`;
  return dwn(zip_url, `${to}.zip`, () =>
    fs.createReadStream(`${to}.zip`)
      .pipe(unzip.Extract({path: to}))
      .on('close', () => cb())
  );
}

function dwn(url, to, cb) {
  const file = fs.createWriteStream(to);
  http.get(url, (resp) => {
    resp.pipe(file);
    file.on('finish', () => file.close(cb) );
  });
}
