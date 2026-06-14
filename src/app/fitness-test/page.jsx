'use client'
import { useState } from 'react'

const jobData = {
  消防士: {
    description: '災害現場での救助活動に必要な体力を測定。自治体により種目は異なるが、腕立て・腹筋・持久走が中心。',
    items: [
      { name: '腕立て伏せ', purpose: '筋持久力', note: 'ほぼ全自治体で実施' },
      { name: '上体起こし（腹筋）', purpose: '筋持久力', note: 'ほぼ全自治体で実施' },
      { name: '反復横跳び', purpose: '敏捷性', note: '多くの自治体で実施' },
      { name: '20mシャトルラン or 1km走', purpose: '持久力', note: 'どちらかが実施される' },
      { name: '握力', purpose: '筋力', note: '一部自治体で実施' },
      { name: '立ち幅跳び', purpose: '瞬発力', note: '一部自治体で実施' },
    ],
    jieitai: '腕立て・腹筋・持久走は自衛隊の基礎訓練そのもの。自衛隊式で鍛えれば全種目に対応できる。',
  },
  警察官: {
    description: '職務遂行に必要な基礎体力を測定。合格基準は低めに設定されているが、高得点ほど有利。',
    items: [
      { name: '腕立て伏せ', purpose: '筋持久力', note: 'ほぼ全都道府県で実施' },
      { name: '上体起こし（腹筋）', purpose: '筋持久力', note: 'ほぼ全都道府県で実施' },
      { name: '反復横跳び', purpose: '敏捷性', note: 'ほぼ全都道府県で実施' },
      { name: '20mシャトルラン', purpose: '持久力', note: '多くの都道府県で実施' },
      { name: '握力', purpose: '筋力', note: '多くの都道府県で実施' },
      { name: '立ち幅跳び', purpose: '瞬発力', note: '一部都道府県で実施' },
    ],
    jieitai: '警察の体力試験は筋力系と持久力系が中心。自衛隊式の全身トレーニングで十分対応可能。',
  },
  自衛隊: {
    description: '自衛官としての基本体力を測定。種目は統一されており、基準も明確。',
    items: [
      { name: '腕立て伏せ', purpose: '筋持久力', note: '全部隊で実施' },
      { name: '上体起こし（腹筋）', purpose: '筋持久力', note: '全部隊で実施' },
      { name: '懸垂', purpose: '上半身筋力', note: '全部隊で実施' },
      { name: '3km走', purpose: '持久力', note: '全部隊で実施' },
    ],
    jieitai: '自衛隊の体力試験は最も基準が明確。このメニューをクリアすれば消防・警察の体力試験も余裕で合格できる。',
  },
}

export default function FitnessTestPage() {
  const [job, setJob] = useState('消防士')
  const data = jobData[job]

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: 'white', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>

        <div style={{ marginBottom: '2rem' }}>
          <p style={{ color: '#22c55e', fontSize: '12px', letterSpacing: '0.15em', margin: '0 0 4px' }}>FITNESS GUIDE</p>
          <h1 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 8px' }}>体力試験ガイド</h1>
          <p style={{ color: '#888', fontSize: '14px', margin: 0 }}>自衛隊式で消防・警察の体力試験を突破せよ。</p>
        </div>

        {/* 自衛隊式が最強という説明 */}
        <div style={{ background: '#0f2a1a', border: '1px solid #22c55e', borderRadius: '8px', padding: '1.5rem', marginBottom: '2rem' }}>
          <p style={{ color: '#22c55e', fontSize: '12px', letterSpacing: '0.1em', margin: '0 0 8px' }}>COMMANDER'S ANALYSIS</p>
          <p style={{ fontSize: '15px', fontWeight: '700', margin: '0 0 8px', color: '#e8f0e4' }}>
            自衛隊式トレーニングで消防・警察の体力試験に合格できる理由
          </p>
          <p style={{ color: '#a8c4a0', fontSize: '13px', lineHeight: '1.8', margin: '0 0 12px' }}>
            消防・警察の体力試験の中心種目は<span style={{ color: '#fff', fontWeight: '700' }}>腕立て・腹筋・持久走</span>。
            これらはすべて自衛隊の日常訓練そのものだ。
            自衛隊式で基礎体力を鍛えれば、消防・警察の体力試験は余裕でクリアできる。
          </p>
          <div style={{ borderTop: '1px solid #1a4a2a', paddingTop: '12px' }}>
            <p style={{ color: '#6b9e6b', fontSize: '12px', margin: 0 }}>元自衛隊 × パーソナルトレーナー監修</p>
          </div>
        </div>

        {/* 職種選択 */}
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ color: '#888', fontSize: '12px', margin: '0 0 8px' }}>職種を選んで体力試験の種目を確認</p>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['消防士', '警察官', '自衛隊'].map((j) => (
              <button key={j} onClick={() => setJob(j)} style={{
                flex: 1, padding: '10px', borderRadius: '6px',
                border: `1px solid ${job === j ? '#22c55e' : '#333'}`,
                background: job === j ? '#14532d' : '#1a1a1a',
                color: job === j ? '#22c55e' : '#888',
                fontSize: '14px', cursor: 'pointer', fontWeight: job === j ? '700' : '400'
              }}>{j}</button>
            ))}
          </div>
        </div>

        {/* 職種説明 */}
        <div style={{ background: '#111', border: '1px solid #222', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem' }}>
          <p style={{ color: '#888', fontSize: '13px', margin: 0, lineHeight: '1.7' }}>{data.description}</p>
        </div>

        {/* 種目表 */}
        <div style={{ background: '#111', border: '1px solid #222', borderRadius: '8px', overflow: 'hidden', marginBottom: '1.5rem' }}>
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #222' }}>
            <p style={{ color: '#22c55e', fontSize: '12px', margin: 0, letterSpacing: '0.1em' }}>{job}の体力試験種目</p>
          </div>
          {data.items.map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 1.5rem',
              borderBottom: i < data.items.length - 1 ? '1px solid #1a1a1a' : 'none'
            }}>
              <div>
                <p style={{ fontSize: '14px', fontWeight: '600', margin: '0 0 2px' }}>{item.name}</p>
                <p style={{ color: '#666', fontSize: '12px', margin: 0 }}>{item.purpose}</p>
              </div>
              <p style={{ color: '#888', fontSize: '12px', margin: 0, textAlign: 'right' }}>{item.note}</p>
            </div>
          ))}
        </div>

        {/* 自衛隊式との関連 */}
        <div style={{ background: '#1a1a0a', border: '1px solid #854d0e', borderRadius: '8px', padding: '1.5rem', marginBottom: '2rem' }}>
          <p style={{ color: '#fbbf24', fontSize: '12px', letterSpacing: '0.1em', margin: '0 0 8px' }}>自衛隊式との関連</p>
          <p style={{ color: '#fef3c7', fontSize: '13px', lineHeight: '1.8', margin: 0 }}>{data.jieitai}</p>
        </div>

        <div style={{ background: '#111', border: '1px solid #222', borderRadius: '8px', padding: '1rem', textAlign: 'center' }}>
          <p style={{ color: '#666', fontSize: '12px', margin: 0 }}>
            ※各自治体・採用年度により種目・基準は異なります。必ず受験先の公式情報を確認してください。
          </p>
        </div>
      </div>
    </div>
  )
}