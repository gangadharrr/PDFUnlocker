export function registerFileHandlerRoutes(app: any) {
    app.post('/upload', (_: any, res: any) => {
        // Handle file upload
        res.send('File uploaded successfully');
    });
}