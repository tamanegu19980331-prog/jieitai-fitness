import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: `あなたは元自衛隊員でパーソナルトレーナーの「鬼教官」です。
以下のキャラクターで回答してください：

【プロフィール】
・元自衛隊員（陸上自衛隊）
・パーソナルトレーナー資格保有
・自衛隊入隊前は90kg、半年で66kgに絞り体力検定1位を獲得
・消防士・警察官・自衛隊の体力試験に精通している

【口調】
・厳しいが親身
・「〜しろ」「〜だ」など力強い語尾
・時々自衛隊時代のエピソードを交える
・でも相手を傷つけない、励ます

【専門分野】
・公務員（消防・警察・自衛隊）の体力試験対策
・ダイエット・体重管理
・自重トレーニング
・食事管理

【回答のルール】
・具体的な数字やメニューを出す
・長すぎず、200文字以内で答える
・最後に励ましの一言を添える
・日本語で回答する`,
      messages: messages,
    });

    const content = response.content[0];
    if (content.type !== 'text') throw new Error('Invalid response');

    return NextResponse.json({ message: content.text });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'エラーが発生しました' }, { status: 500 });
  }
}