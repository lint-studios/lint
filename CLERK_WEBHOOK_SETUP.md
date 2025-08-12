# Clerk Organization Webhook Setup

This guide will help you configure Clerk webhooks to automatically sync organization data with your Supabase database.

## 🚀 Quick Setup

### 1. Configure Environment Variables

Add this to your `.env` file:

```env
# Clerk Webhook Secret (get this from Clerk Dashboard)
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

### 2. Set Up Webhook in Clerk Dashboard

1. **Go to Clerk Dashboard** → Your Application → Webhooks
2. **Click "Add Endpoint"**
3. **Endpoint URL**: `https://your-domain.com/api/webhooks/clerk`
   - For development: `https://your-ngrok-url.ngrok.io/api/webhooks/clerk`
4. **Select Events**:
   - ✅ `organization.created`
   - ✅ `organization.updated` 
   - ✅ `organization.deleted`
5. **Copy the Webhook Secret** and add it to your `.env` file

### 3. Test the Integration

When you create an organization in Clerk, it will automatically:
- ✅ Create a record in your `organizations` table
- ✅ Use the Clerk `orgId` as the primary key
- ✅ Store organization name, slug, and logo URL
- ✅ Handle updates and deletions

## 🔧 Webhook Event Handling

The webhook handles these Clerk events:

| Event | Action | Database Operation |
|-------|--------|-------------------|
| `organization.created` | Creates new org | `INSERT` into organizations |
| `organization.updated` | Updates existing org | `UPDATE` organizations |
| `organization.deleted` | Removes org | `DELETE` from organizations |

## 🛠️ Development Testing

To test webhooks locally:

1. **Install ngrok**: `npm install -g ngrok`
2. **Start your dev server**: `npm run dev`
3. **Expose localhost**: `ngrok http 3000`
4. **Use ngrok URL** in Clerk webhook endpoint
5. **Test by creating an org** in Clerk Dashboard

## 📋 Data Mapping

Clerk organization data maps to your database as follows:

```typescript
// Clerk Org Data → Database Fields
{
  id: clerkOrgId,           // Primary key
  name: organization.name,   // Required
  slug: organization.slug,   // Optional
  logoUrl: organization.image_url, // Optional
  siteUrl: null,            // Set manually via your app
  industry: null,           // Set manually via your app  
  platform: null,           // Set manually via your app
  timezone: null,           // Set manually via your app
  createdAt: organization.created_at,
  updatedAt: organization.updated_at
}
```

## 🔐 Security

- Webhook payloads are verified using Clerk's `svix` signature verification
- Invalid signatures are rejected with 400 status
- All database operations are wrapped in try/catch blocks
- Errors are logged for debugging

## 🎯 Next Steps

After setup, when users create organizations through Clerk, they'll automatically appear in your Supabase database and be ready for use with your HelloLint dashboard features!
