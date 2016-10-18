const config = {
    tg: {
        botToken: 'BOT_TOKEN',
        botUsername: 'BOT_USERNAME'
    },
    gcloud: {
        projectId: 'GCLOUD_PROJECT',
        storageBucket: 'STORAGE_BUCKET'
    },
    api: {
        port: 'PORT',
        fetchInterval: 15, // frequency in seconds of main photo feed query
        adminTokens: [
            'ADMIN_ACCESS_TOKEN'
        ]
    }
};

export default config;
