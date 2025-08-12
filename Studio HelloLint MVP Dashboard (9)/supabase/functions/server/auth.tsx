// Authentication routes for HelloLint dashboard
import { Hono } from "npm:hono";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const app = new Hono();

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Sign up new user
app.post('/make-server-a4cd0473/auth/signup', async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    // Create user with admin API to auto-confirm email
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name: name || 'HelloLint User' },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log(`Signup error: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ 
      success: true, 
      message: 'Account created successfully!',
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name
      }
    });

  } catch (error) {
    console.log(`Signup error: ${error}`);
    return c.json({ error: 'Failed to create account' }, 500);
  }
});

// Verify user session
app.get('/make-server-a4cd0473/auth/user', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No access token provided' }, 401);
    }

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user) {
      return c.json({ error: 'Invalid or expired token' }, 401);
    }

    return c.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || 'HelloLint User',
        created_at: user.created_at
      }
    });

  } catch (error) {
    console.log(`User verification error: ${error}`);
    return c.json({ error: 'Failed to verify user' }, 500);
  }
});

// Password reset request
app.post('/make-server-a4cd0473/auth/reset-password', async (c) => {
  try {
    const body = await c.req.json();
    const { email } = body;

    if (!email) {
      return c.json({ error: 'Email is required' }, 400);
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${c.req.header('origin')}/reset-password`
    });

    if (error) {
      console.log(`Password reset error: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ 
      success: true, 
      message: 'Password reset instructions sent to your email' 
    });

  } catch (error) {
    console.log(`Password reset error: ${error}`);
    return c.json({ error: 'Failed to send reset email' }, 500);
  }
});

// Update user profile
app.put('/make-server-a4cd0473/auth/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'Authentication required' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError || !user) {
      return c.json({ error: 'Invalid authentication' }, 401);
    }

    const body = await c.req.json();
    const { name, email } = body;

    const updateData: any = {};
    if (name) updateData.name = name;
    if (email && email !== user.email) updateData.email = email;

    if (Object.keys(updateData).length === 0) {
      return c.json({ error: 'No valid fields to update' }, 400);
    }

    const { data, error } = await supabase.auth.admin.updateUserById(
      user.id,
      {
        user_metadata: { ...user.user_metadata, ...updateData }
      }
    );

    if (error) {
      console.log(`Profile update error: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    return c.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name
      }
    });

  } catch (error) {
    console.log(`Profile update error: ${error}`);
    return c.json({ error: 'Failed to update profile' }, 500);
  }
});

export default app;