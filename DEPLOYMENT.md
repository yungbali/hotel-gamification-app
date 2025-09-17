# Hotel Gamification App - AWS Amplify Deployment Guide

## 🚀 Quick Deployment Steps

### 1. Prerequisites
- AWS Account with Amplify access
- Git repository (GitHub/GitLab/Bitbucket)
- Node.js 18+ installed locally

### 2. Deploy to AWS Amplify

#### Option A: AWS Console (Recommended)
1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click "New app" → "Host web app"
3. Connect your Git repository
4. Select branch: `main`
5. Review build settings (amplify.yml is already configured)
6. Click "Save and deploy"

#### Option B: AWS CLI
```bash
# Install AWS CLI and Amplify CLI
npm install -g @aws-amplify/cli
aws configure

# Initialize and deploy
amplify init
amplify add hosting
amplify publish
```

### 3. Update Production URLs

After deployment, update the QR code service with your actual Amplify URL:

1. Get your Amplify app URL from the console
2. Update `src/services/qrCodeService.ts` line 24:
   ```typescript
   ? 'https://YOUR-ACTUAL-AMPLIFY-URL.amplifyapp.com'
   ```

### 4. Environment Variables (Optional)

In Amplify Console → App settings → Environment variables:
```
NODE_ENV=production
EXPO_PUBLIC_API_URL=https://your-api-domain.com
```

### 5. Deploy Feedback Server

The feedback server needs to be deployed separately:

#### Option A: Vercel (Easiest)
```bash
npm install -g vercel
vercel --prod
```

#### Option B: AWS Lambda
- Create Lambda function
- Upload feedback-server.js
- Set up API Gateway

#### Option C: AWS EC2
- Launch EC2 instance
- Install Node.js
- Run feedback server

### 6. Test Deployment

1. **Web App:** Visit your Amplify URL
2. **Login:** Use demo accounts:
   - Waiter: `waiter@hotel.com` / `password`
   - Manager: `manager@hotel.com` / `password`
3. **QR Codes:** Generate and test feedback flow
4. **Mobile:** Use Expo Go with production URL

## 🔧 Build Configuration

The app uses `amplify.yml` for build configuration:
- Installs dependencies
- Exports Expo web build
- Serves from `dist/` directory

## 📱 Mobile Testing

### Expo Go
1. Install Expo Go app
2. Scan QR code from Amplify deployment
3. Test full functionality

### Web Browser
- Works on any device with modern browser
- Responsive design for mobile/tablet

## 🐛 Troubleshooting

### Build Fails
- Check Node.js version (18+ required)
- Verify all dependencies in package.json
- Check amplify.yml syntax

### QR Codes Not Working
- Update baseUrl in qrCodeService.ts
- Ensure feedback server is deployed
- Check CORS settings

### Mobile App Issues
- Clear Expo cache: `expo r -c`
- Check network connectivity
- Verify Amplify URL is accessible

## 📊 Monitoring

- **Amplify Console:** View build logs and performance
- **CloudWatch:** Monitor serverless functions
- **Expo Analytics:** Track app usage (if enabled)

## 🔄 Continuous Deployment

Every push to `main` branch will trigger automatic deployment.

## 📞 Support

For issues:
1. Check AWS Amplify documentation
2. Review build logs in Amplify console
3. Test locally first with `npx expo export --platform web`
