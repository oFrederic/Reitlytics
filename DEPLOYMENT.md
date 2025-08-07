# Netlify Deployment Guide

## Security Measures for Mapbox Free Tier Protection

### 1. Environment Variables Setup

In your Netlify dashboard, set these environment variables:

```bash
NEXT_PUBLIC_MAPBOX_TOKEN=pk.your_token_here
NEXT_PUBLIC_MAPBOX_STYLE=mapbox://styles/mapbox/streets-v12
NODE_ENV=production
```

### 2. Mapbox Token Security

**⚠️ IMPORTANT:** Your Mapbox token will be visible in the client-side code. To protect it:

1. **Set up domain restrictions** in your Mapbox account:
   - Go to Mapbox Account → Access Tokens
   - Add your Netlify domain to the "URL restrictions"
   - Example: `https://your-app.netlify.app/*`

2. **Monitor usage** in Mapbox dashboard:
   - Set up usage alerts
   - Check usage regularly

### 3. Built-in Protections

This app includes several protection layers:

- **Usage monitoring**: Limits requests per hour/day
- **Token validation**: Checks token format
- **Rate limiting**: Prevents abuse
- **Security headers**: Protects against token theft

### 4. Deployment Steps

1. **Connect to Netlify**:
   ```bash
   # Push your code to GitHub
   git add .
   git commit -m "Add security protections"
   git push
   ```

2. **Deploy on Netlify**:
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `.next`
   - Add environment variables

3. **Verify deployment**:
   - Check that map loads correctly
   - Test usage limits
   - Monitor Mapbox dashboard

### 5. Monitoring & Alerts

**Set up alerts for:**
- Mapbox usage approaching limits
- Unusual traffic spikes
- Token usage from unexpected domains

**Regular checks:**
- Weekly usage review
- Monthly cost monitoring
- Security audit

### 6. Fallback Plan

If you exceed free tier limits:
1. **Immediate**: Disable map functionality
2. **Short-term**: Implement stricter rate limiting
3. **Long-term**: Consider paid tier or alternative mapping service

### 7. Additional Security Recommendations

- **Use a separate token** for production
- **Regular token rotation** (every 6 months)
- **Monitor for token abuse** in Mapbox logs
- **Consider server-side proxy** for sensitive operations

## Usage Limits

Current limits (configurable in `MapUsageMonitor`):
- **Hourly**: 500 requests
- **Daily**: 5,000 requests
- **Monthly**: 50,000 requests (Mapbox free tier)

These limits are well below Mapbox free tier to provide safety margin.
