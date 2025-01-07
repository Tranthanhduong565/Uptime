import express from 'express';
import fs from 'fs';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3000;
const INTERVAL = 5 * 60 * 1000;
const FILE_PATH = 'urls.json';

const loadUrls = () => {
  try {
    const data = fs.readFileSync(FILE_PATH, 'utf8');
    const parsed = JSON.parse(data);
    return parsed.urls || [];
  } catch {
    return [];
  }
};

const saveUrls = (urls) => {
  try {
    fs.writeFileSync(FILE_PATH, JSON.stringify({ urls }, null, 2));
  } catch {
    console.error('Không thể lưu danh sách URL');
  }
};

const pingUrls = async (urls) => {
  for (const url of urls) {
    try {
      await axios.get(url);
      console.log(`Ping thành công: ${url}`);
    } catch {
      console.log(`Ping thất bại: ${url}`);
    }
  }
};

setInterval(() => {
  const urls = loadUrls();
  if (urls.length > 0) pingUrls(urls);
}, INTERVAL);

app.get('/add', (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send('Vui lòng cung cấp URL.');
  const urls = loadUrls();
  if (urls.includes(url)) return res.status(400).send('URL đã tồn tại.');
  urls.push(url);
  saveUrls(urls);
  res.send(`Đã thêm URL: ${url}`);
});

app.get('/', (req, res) => {
  res.send('Server uptime đang chạy!');
});

app.listen(PORT, () => console.log(`Server chạy tại cổng ${PORT}`));
