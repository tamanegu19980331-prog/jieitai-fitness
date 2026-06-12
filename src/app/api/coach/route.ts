import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { division, level } = await req.json();
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'APIキーが設定されていません。' }, { status: 500 });
    }
    const divisions: Record<string, string> = {
      ground: '陸上自衛隊の歩兵訓練スタイル。持久力・筋力・敏捷性を重視。',
      maritime: '海上自衛隊のスタイル。体幹・上半身・バランス感覚を重視。',
      air: '航空自衛隊のスタイル。俊敏性・集中力・全身持久力を重視。',
    };
    const levels: Record<string, string> = {
      recruit: '新隊員レベル。基礎的な自重トレーニング。各種目10〜15回、休憩60秒。',
      general: '一般隊員レベル。中強度の自重トレーニング。各種目15〜20回、休憩45秒。',
      ranger: 'レンジャーレベル。高強度の自重トレーニング。各種目20〜30回、休憩30秒。',
    };
    const response = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: `部隊:${divisions[division]} 練度:${levels[level]} 自宅でできる自衛隊式トレーニングメニューをJSON形式のみで返せ。必ずJSON以外は出力するな。{"missionName":"作戦名","warmup":[{"name":"種目名","sets":"セット数","reps":"回数","rest":"休憩","icon":"絵文字","tip":"ポイント"}],"main":[{"name":"種目名","sets":"セット数","reps":"回数","rest":"休憩","icon":"絵文字","tip":"ポイント"}],"cooldown":[{"name":"種目名","sets":"セット数","reps":"回数","rest":"休憩","icon":"絵文字","tip":"ポイント"}],"commanders_note":"教官の一言"}`
      }],
    });
    const content = response.content[0];
    if (content.type !== 'text') throw new Error('Invalid response type');
    const jsonText = content.text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const menu = JSON.parse(jsonText);
    return NextResponse.json({ menu });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: '訓練メニューの生成中にエラーが発生しました。' }, { status: 500 });
  }
}