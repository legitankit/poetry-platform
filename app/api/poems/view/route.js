import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { poemId, userId, sessionId } = await request.json()
    const supabase = createRouteHandlerClient({ cookies })
    
    // Check if already viewed in last 24 hours
    const twentyFourHoursAgo = new Date()
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24)
    
    let query = supabase
      .from('poem_views')
      .select('id')
      .eq('poem_id', poemId)
      .gte('viewed_at', twentyFourHoursAgo.toISOString())
    
    if (userId) {
      query = query.eq('user_id', userId)
    } else {
      query = query.eq('session_id', sessionId)
    }
    
    const { data: existingView } = await query
    
    if (!existingView || existingView.length === 0) {
      // Unique view - increment counter
      await supabase.from('poem_views').insert({
        poem_id: poemId,
        user_id: userId || null,
        session_id: sessionId,
      })
      
      await supabase.rpc('increment_views', { poem_id: poemId })
      
      return NextResponse.json({ unique: true })
    }
    
    return NextResponse.json({ unique: false })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}