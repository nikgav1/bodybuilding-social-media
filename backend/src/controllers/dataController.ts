import express from 'express';

export const uploadPhoto = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    res.status(200).json({
      message: 'File uploaded successfully',
      file: req.file,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({
      message: 'Error uploading file',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
