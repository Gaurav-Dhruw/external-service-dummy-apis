import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import cors from 'cors';
import multer from "multer";
import axios, { isAxiosError } from "axios";

const app = express();
const upload = multer();

app.use(express.json(), express.urlencoded());
app.use(cors());

app.post('/github/commit-file', upload.single('file'), async (req, res) => {
   try {
      const file = req.file;
      const file_name = file.filename;
      const file_content = file.buffer.toString();

      const { commit_message } = req.body;
      const folder_path = process.env.REPO_FOLDER_PATH;

      const path = `${folder_path}/${file_name}`;
      const repo = process.env.GITHUB_REPO_NAME;
      const owner = process.env.GITHUB_REPO_OWNER;
      const access_token = process.env.GITHUB_ACCESS_TOKEN;
      const branch = process.env.REPO_BRANCH;
      const base_url = process.env.GITHUB_REST_API_BASE_URL;

      const url = `${base_url}/repos/${owner}/${repo}/contents/${path}`;

      const axiosInstance = axios.create({
         baseURL: url,
         headers: {
            Authorization: `Bearer ${access_token}`,
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
         }
      });

      let sha = '';
      try {
         const { data } = await axiosInstance.get('', { params: { ref: branch } });

         sha = data.sha;
      } catch (error) {

         if (isAxiosError(error) && error.response?.status !== 404) {
            throw error;
         }
      }


      const commitPayload = {
         message: commit_message,
         content: file_content,
         sha: sha || undefined,
         branch,
      }

      await axiosInstance.put('', commitPayload);

      res.status(200).json({ message: "File Committed Successfully" });

   } catch (error) {
      res.sendStatus(500);
   }
});

app.post('/bitbucket/commit-file', async (req, res) => {
   try {
      const { file_content, file_name, commit_message } = req.body;

      const folder_path = process.env.REPO_FOLDER_PATH;
      const path = `${folder_path}/${file_name}`;
      const repo_slug = process.env.BITBUCKET_REPO_SLUG;
      const workspace = process.env.BITBUCKET_WORKSPACE
      const access_token = process.env.BITBUCKET_ACCESS_TOKEN;
      const branch = process.env.REPO_BRANCH;
      const base_url = process.env.BITBUCKET_REST_API_BASE_URL;

      const url = `${base_url}/repositories/${workspace}/${repo_slug}/src`;
      console.log(url);
      const axiosInstance = axios.create({
         baseURL: url,
         headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
         }
      });

      let parents = [];

      try {
         const { data } = await axiosInstance.get(`/${branch}/${path}?format=meta`);

         parents = [data.commit.hash];
      } catch (error) {
         if (isAxiosError(error) && error.response?.status !== 404) {
            throw error;
         }
      }


      const payload = new URLSearchParams();
      payload.append('message', commit_message);
      payload.append('branch', branch);
      payload.append('parents', parents.join(','));
      payload.append(path, file_content);


      await axiosInstance.post('', payload.toString());

      res.status(200).json({ message: "File Committed Successfully" });

   } catch (error) {
      console.log(error);
      res.sendStatus(500);
   }
});


app.post('/service-now/ticket/', (req, res) => {
   try {


   } catch (error) {
      res.sendStatus(500);
   }
});

app.get('service-now/ticket/:ticket_id', (req, res) => {
   try {
      const ticket_id = req.params.ticket_id;

      

   } catch (error) {
      res.sendStatus(500);
   }
});


app.listen(8000, () => {
   console.log("server listening on http://localhost:8000");
});


