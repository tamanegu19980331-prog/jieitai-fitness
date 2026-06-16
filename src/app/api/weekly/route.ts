import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { goal, division } = await req.json();

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2000,
      messages: [{
        role: 'user',
content: `自衛隊式トレーニングで「${goal}」を達成するための1週間メニューをJSON形式のみで返せ。部隊は${division}。器具不要の自宅でできる自重トレーニングのみ使用すること。必ずJSON以外は出力するな。[
  {
    "day": "月曜日",
    "focus": "この日のテーマ",
    "exercises": [
      {"name": "種目名", "sets": "3", "reps": "10回", "rest": "60秒"}
    ],
    "note": "教官からの一言アドバイス"
  }
]
7日分返せ。休息日も含めること。`
      }],
    });

    const content = response.content[0];
    if (content.type !== 'text') throw new Error('Invalid response');
    const jsonText = content.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const menu = JSON.parse(jsonText);

    return NextResponse.json({ menu });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'エラーが発生しました' }, { status: 500 });
  }
}