
import EmojiTicTacToe from '../components/EmojiTicTacToe';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 drop-shadow-lg">
            🎮 Emoji Tic Tac Toe
          </h1>
          <p className="text-lg md:text-xl text-white/90 drop-shadow">
            Choose your emoji category and strategically place 3 in a row!
          </p>
        </div>
        <EmojiTicTacToe />
      </div>
    </div>
  );
};

export default Index;
