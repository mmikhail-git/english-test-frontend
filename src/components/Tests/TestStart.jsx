import React, { useState } from 'react';
import { Button, TextField, Box, Typography } from '@mui/material';

const TestStart = ({ onStartTest }) => {
    const [hardnessLevel, setHardnessLevel] = useState(1);
    const [useMyDict, setUseMyDict] = useState(false);

    const handleStart = () => {
        onStartTest({
            hardness_level: hardnessLevel,
            useMyDict: useMyDict,
        });
    };

    return (
        <Box sx={{ maxWidth: 400, margin: 'auto', mt: 4, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>
                Начать тест
            </Typography>
            <TextField
                fullWidth
                label="Уровень сложности"
                type="number"
                value={hardnessLevel}
                onChange={(e) => setHardnessLevel(parseInt(e.target.value))}
                margin="normal"
                inputProps={{ min: 1, max: 5 }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <input
                    type="checkbox"
                    checked={useMyDict}
                    onChange={(e) => setUseMyDict(e.target.checked)}
                />
                <Typography variant="body1" sx={{ ml: 1 }}>
                    Использовать мой словарь
                </Typography>
            </Box>
            <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleStart}
                sx={{ mt: 2 }}
            >
                Начать тест
            </Button>
        </Box>
    );
};

export default TestStart;