/* eslint-disable prefer-const */
/* eslint-disable no-promise-executor-return */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-constant-condition */
import { ASSEMBLY_AUTHORIZATION_TOKEN } from '@/configs/environment.config';
import axios from 'axios';
import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import multer from 'multer';

const baseUrl = 'https://api.assemblyai.com/v2';

const router = Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({
    message: 'Typescript Express Backend',
    success: true,
    code: StatusCodes.OK,
  });
});

router.post('/convert', upload.single('file'), async (req: Request, res: Response) => {
  try {
    const file = req.file;
    const headers = {
      authorization: ASSEMBLY_AUTHORIZATION_TOKEN,
    };
    const uploadResponse = await axios.post(`${baseUrl}/upload`, file?.buffer, {
      headers,
    });
    const uploadUrl = uploadResponse.data.upload_url;
    const response = await axios.post(
      `${baseUrl}/transcript`,
      {
        audio_url: uploadUrl,
        language_code: 'vi',
      },
      { headers },
    );
    const transcriptId = response.data.id;
    const pollingEndpoint = `${baseUrl}/transcript/${transcriptId}`;

    let result = '';

    while (true) {
      const pollingResponse = await axios.get(pollingEndpoint, {
        headers,
      });
      const transcriptionResult = pollingResponse.data;
      if (transcriptionResult.status === 'completed') {
        result = transcriptionResult.text;
        break;
      } else if (transcriptionResult.status === 'error') {
        throw new Error(`Transcription failed: ${transcriptionResult.error}`);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }

    res.status(StatusCodes.OK).json({
      transcript: result,
      success: true,
      code: StatusCodes.OK,
    });
  } catch (error) {
    throw new Error(error as string);
  }
});

export const apis_v1 = router;
