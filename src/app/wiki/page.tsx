import { getWiki, createWikiItem } from '@/app/actions/wiki';
import { FolderOpen, Plus, Tag } from 'lucide-react';
import WikiAccordion from '@/app/components/WikiAccordion';
// import StudioNav from '../components/StudioNav';
// revalidatePath removed
export const dynamic = 'force-dynamic';

export default async function WikiPage() {
    const groupedWiki = await getWiki();
    const categories = Object.keys(groupedWiki);

    return (
        <div className="min-h-screen bg-black text-white font-body relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay"></div>



            <div className="relative z-10 max-w-7xl mx-auto w-full px-8 pb-32 pt-12 animate-fade-in space-y-12">
                <header className="flex justify-between items-end border-b border-white/10 pb-6 gap-6">
                    <div>
                        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tighter text-white neon-text-white uppercase leading-none">
                            Knowledge <span className="text-void-purple neon-text">Base</span>
                        </h1>
                        <p className="text-neutral-400 mt-2 font-mono text-sm tracking-widest uppercase">
                            The Architect&apos;s Wisdom
                        </p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                    {/* Add Item Form */}
                    <div className="md:col-span-4 lg:col-span-3">
                        <div className="glass-panel p-6 sticky top-8 space-y-6">
                            <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                                <Plus size={20} className="text-void-purple text-glow" /> New Entry
                            </h2>
                            <form action={async (formData) => {
                                'use server';
                                await createWikiItem(formData);
                            }} className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block mb-1">Category</label>
                                    <div className="relative">
                                        <Tag className="absolute left-3 top-3 text-neutral-500" size={14} />
                                        <select name="category" className="input text-sm pl-10 appearance-none cursor-pointer" defaultValue="Technical Standards">
                                            <option value="Technical Standards">Technical Standards</option>
                                            <option value="De-escalation">De-escalation</option>
                                            <option value="Workflow">Workflow</option>
                                            <option value="Gear Settings">Gear Settings</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block mb-1">Title</label>
                                    <input name="title" placeholder="e.g. Vocal Chain for Rap" className="input text-sm" required />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block mb-1">Content</label>
                                    <textarea name="content" rows={4} placeholder="The wisdom..." className="input text-sm resize-none" required />
                                </div>
                                <button className="w-full btn-primary py-3 text-xs uppercase tracking-widest">
                                    Archive Wisdom
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Wiki Content */}
                    <div className="md:col-span-8 lg:col-span-9 space-y-12">
                        {categories.length === 0 ? (
                            <div className="text-center p-12 border border-dashed border-white/10 rounded-2xl text-neutral-500 font-mono text-sm uppercase tracking-widest">
                                The library is empty. Start documenting.
                            </div>
                        ) : (
                            categories.map((category) => (
                                <div key={category} className="space-y-6">
                                    <h3 className="text-2xl font-display font-bold text-white flex items-center gap-3 border-b border-void-purple/20 pb-4">
                                        <FolderOpen size={24} className="text-void-purple" /> {category}
                                    </h3>
                                    <div className="space-y-4">
                                        {groupedWiki[category].map((item) => (
                                            <WikiAccordion
                                                key={item.id}
                                                title={item.title}
                                                content={item.content}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
